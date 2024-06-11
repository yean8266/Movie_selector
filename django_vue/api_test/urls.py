from django.conf.urls import url, include
from django.contrib import admin
from django.urls import path,include
from .views import *

urlpatterns = [
    path('index/', index, name='index'), # 意为当访问路径为/index时由index函数处理该请求
    path('send_1/',send_1),
    path('send_2/', send_2),
    path('send_3/', send_3),
    path('send_4/', send_4),
    path('send_5/', send_5),
    path('send_6/', send_6),
    path('send_7/', send_7),
    path('register/',register),
    path('login1/', login1),
    path('login/',login_view),
    path('recent/', recent),
    path('logout/', logout_view),
]