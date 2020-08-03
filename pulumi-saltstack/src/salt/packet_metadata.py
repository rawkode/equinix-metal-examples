import json
import logging
import salt.utils.http as http

# Setup logging
log = logging.getLogger(__name__)

# metadata server information
HOST = "https://metadata.packet.net/metadata"


def packet_metadata():
    response = http.query(HOST)
    metadata = json.loads(response["body"])

    log.error(metadata)

    grains = {}
    grains["id"] = metadata["id"]
    grains["iqn"] = metadata["iqn"]
    grains["plan"] = metadata["plan"]
    grains["class"] = metadata["class"]
    grains["facility"] = metadata["facility"]

    grains["tags"] = metadata["tags"]

    return dict(packet_metadata=grains)
