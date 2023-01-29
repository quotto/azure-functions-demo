#!/bin/bash -e
set -e

# install openvpn client
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get -y install --no-install-recommends openvpn \
apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/library-scripts \

# Remove the OPENVPN_CONFIG variable since we don't neeed it after is written to a file
echo 'OPENVPN_CONFIG=""' >> /etc/environment
echo "unset OPENVPN_CONFIG" | tee -a /etc/bash.bashrc > /etc/profile.d/999-unset-openvpn-config.sh
if [ -d "/etc/zsh" ]; then
    echo "unset OPENVPN_CONFIG" >> /etc/zsh/zshenv
fi


# Switch to the .devcontainer folder
cd "$( dirname "${BASH_SOURCE[0]}" )"

# Create a temporary directory
mkdir -p openvpn-tmp
cd openvpn-tmp

# Save the configuration from the secret if it is present
if [ ! -z "${OPENVPN_CONFIG}" ]; then
    echo "${OPENVPN_CONFIG}" > vpnconfig.ovpn
fi