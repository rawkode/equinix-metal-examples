#!/usr/bin/env sh
apt update
DEBIAN_FRONTEND=noninteractive apt install -y python-zmq python-systemd python-tornado salt-common salt-minion

cat <<EOF >/etc/salt/minion.d/salt-master.conf
master: {{ master_ip }}
EOF

systemctl restart salt-minion
