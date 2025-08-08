FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye

RUN apt update 

RUN apt -y install postgresql-client python3 python3-pip

RUN pip3 install tavern

RUN npm install -g ts-node typescript