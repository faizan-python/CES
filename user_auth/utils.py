import requests
from ces.conf import OTP_LENGTH
from random import randint

from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import get_template


def send_otp_to_mail(user_data, validated_otp_num, user):
    ## Sending Email to User
    subject = "Email - Verification"
    html_template = get_template('user_auth/registration_email.html')
    html_context = {}
    html_context['full_name'] = user_data.get('email')
    if user_data.get('full_name'):
        html_context['full_name'] = user_data.get('full_name')
    html_context['passcode'] = validated_otp_num
    html_content = html_template.render(html_context)

    email_to = user.email
    send_mail(subject, "registered", settings.EMAIL_HOST_USER, [email_to, ], html_message=html_content, fail_silently=False)


def generate_oauth_token(self, username, password):
    client_id = settings.CLIENT_ID
    client_secret = settings.CLIENT_SECRET
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    payload = {'grant_type': 'password',
               'username': username,
               'password': password,
               'client_id': client_id,
               'client_secret': client_secret}

    host = self.request.get_host()
    return (requests.post(
        settings.SERVER_PROTOCOLS + host + "/o/token/",
        data=payload,
        headers=headers))
