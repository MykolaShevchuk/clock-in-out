FROM ubuntu:20.04
ENV DEBIAN_FRONTEND=noninteractive
RUN apt update
RUN apt install -y wget
RUN apt install -y firefox
# Install node
RUN apt install -y curl
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt install -y nodejs
RUN wget https://github.com/mozilla/geckodriver/releases/download/v0.31.0/geckodriver-v0.31.0-linux64.tar.gz
RUN tar -xvf geckodriver-v0.31.0-linux64.tar.gz && mv geckodriver /usr/bin/geckodriver
