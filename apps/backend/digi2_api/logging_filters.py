import logging
from opentelemetry import trace


class TraceContextFilter(logging.Filter):
    def filter(self, record):
        span = trace.get_current_span()
        span_context = span.get_span_context()

        if span_context and span_context.is_valid:
            record.trace_id = format(span_context.trace_id, "032x")
            record.span_id = format(span_context.span_id, "016x")
        else:
            record.trace_id = ""
            record.span_id = ""

        return True