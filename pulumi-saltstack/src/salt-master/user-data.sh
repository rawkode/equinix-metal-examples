#!/usr/bin/env sh
apt update
DEBIAN_FRONTEND=noninteractive apt install -y python-zmq python-systemd python-tornado salt-common salt-master

LOCAL_IPv4=$(ip addr | grep -E -o '10\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}')

cat <<EOF >/etc/salt/master.d/listen-interface.conf
interface: ${LOCAL_IPv4}
EOF

systemctl restart salt-master
