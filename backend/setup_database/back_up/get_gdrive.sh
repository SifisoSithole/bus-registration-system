wget -O gdrive_linux-x64.tar.gz https://github.com/glotlabs/gdrive/releases/download/3.9.1/gdrive_linux-x64.tar.gz

tar -xvf gdrive_linux-x64.tar.gz

sudo mv gdrive /usr/local/bin/gdrive

sudo chmod +x /usr/local/bin/gdrive

rm gdrive_linux-x64.tar.gz

gdrive account add