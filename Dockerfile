FROM andrewosh/binder-base

# no root stuff to do!
USER main

# install demo support
RUN conda install \
    ipywidgets \
    numpy \
  && pip install \
    czml \
    geocoder

RUN /home/main/anaconda/envs/python3/bin/pip install --upgrade pip
RUN /home/main/anaconda/envs/python3/bin/pip install \
    czml \
    geocoder \
    ipywidgets


RUN git clone https://github.com/petrushy/CesiumWidget.git --depth=1

WORKDIR CesiumWidget

RUN python setup.py install
RUN /home/main/anaconda/envs/python3/bin/python setup.py install

# jupyter-pip so crazy. this is cheating, as a real user wouldn't have
# the source checked out...
RUN jupyter nbextension install CesiumWidget/static/CesiumWidget --user --quiet
