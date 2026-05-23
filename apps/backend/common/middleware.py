import logging
import time

from opentelemetry import trace


logger = logging.getLogger("django.request")


class RequestTraceLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start = time.time()

        response = self.get_response(request)

        span = trace.get_current_span()
        span_context = span.get_span_context()

        trace_id = format(span_context.trace_id, "032x")
        span_id = format(span_context.span_id, "016x")

        logger.info(
            "request_completed",
            extra={
                "path": request.path,
                "method": request.method,
                "status_code": response.status_code,
                "duration_ms": round((time.time() - start) * 1000, 2),
                "trace_id": trace_id,
                "span_id": span_id,
            },
        )

        return response