import logging

from opentelemetry import trace
from opentelemetry.trace import get_current_span


logger = logging.getLogger("django.request")



class RequestTraceLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        span = get_current_span()
        span_context = span.get_span_context()

        trace_id = format(span_context.trace_id, "032x")
        span_id = format(span_context.span_id, "016x")

        logger.warning(
            "request_completed",
            extra={
                "trace_id": trace_id,
                "span_id": span_id,
            },
        )

        response = self.get_response(request)

        return response