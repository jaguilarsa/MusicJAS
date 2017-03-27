FROM python:3-onbuild
EXPOSE 8000
CMD [ "gunicorn", "api.wsgi:application", "-b", "0.0.0.0:8000" ]
