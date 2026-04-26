from rest_framework import generics, status
from rest_framework.response import Response

from .serializers import LeadCreateSerializer


class LeadCreateView(generics.CreateAPIView):
    serializer_class = LeadCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        lead = serializer.save()
        return Response(
            {"id": lead.id, "status": lead.status},
            status=status.HTTP_201_CREATED,
        )
