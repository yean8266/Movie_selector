from django.contrib import admin
from django.urls import path
from django.conf.urls import url, include
from django.contrib import admin
from django.views.generic import TemplateView
import api_test.urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(api_test.urls)),
    # 意为当访问路径为/index时由index函数处理该请求
]