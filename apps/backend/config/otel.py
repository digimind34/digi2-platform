import os

from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.django import DjangoInstrumentor
from opentelemetry.instrumentation.logging import LoggingInstrumentor
from opentelemetry.instrumentation.psycopg2 import Psycopg2Instrumentor
from opentelemetry.instrumentation.requests import RequestsInstrumentor
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor


_initialized = False


def _env_bool(name, default):
    return os.getenv(name, default).lower() in ("1", "true", "yes", "on")


def initialize_otel():
    global _initialized

    if _initialized:
        return

    resource = Resource.create({
        "service.name": os.getenv("OTEL_SERVICE_NAME", "digi2-backend"),
    })

    provider = TracerProvider(resource=resource)
    processor = BatchSpanProcessor(
        OTLPSpanExporter(
            endpoint=os.getenv(
                "OTEL_EXPORTER_OTLP_TRACES_ENDPOINT",
                "http://tempo:4318/v1/traces",
            ),
        )
    )

    provider.add_span_processor(processor)
    trace.set_tracer_provider(provider)

    DjangoInstrumentor().instrument()
    RequestsInstrumentor().instrument()
    Psycopg2Instrumentor().instrument()
    LoggingInstrumentor().instrument(set_logging_format=True)

    _initialized = True


if _env_bool("OTEL_MANUAL_INSTRUMENTATION_ENABLED", "false"):
    initialize_otel()
