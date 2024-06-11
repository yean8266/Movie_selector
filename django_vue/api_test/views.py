from django.shortcuts import render, redirect
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.decorators import login_required
from .models import MovieData, UserSearchRecord
import json
from zhipuai import ZhipuAI
from django.core.cache import cache
from django.db import transaction

def index(request):
    return render(request, 'index.html', locals())

def login_view(request):
    return render(request, 'login.html')

@csrf_exempt
@require_http_methods(["POST"])
def register(request):
    username = request.POST.get('reg_username')
    password = request.POST.get('reg_password')
    if User.objects.filter(username=username).exists():
        return JsonResponse({'success': False, 'message': '用户名已存在'})
    user = User.objects.create_user(username=username, password=password)
    user.save()
    return JsonResponse({'success': True})

@csrf_exempt
@require_http_methods(["POST"])
def login1(request):
    username = request.POST.get('username')
    password = request.POST.get('password')
    user = authenticate(username=username, password=password)
    if user is not None:
        auth_login(request, user)
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'success': False, 'message': '用户名或密码错误'})

def logout_view(request):
    auth_logout(request)
    return redirect('/api/index/')

@login_required(login_url='/api/login/')
def recent(request):
    user_records = UserSearchRecord.objects.filter(user=request.user).order_by('-searched_at')
    return render(request, 'recent.html', {'records': user_records})

def get_movie_data(request, template, field):
    try:
        json_data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    prompt = json_data.get('prompt')
    if not prompt:
        return JsonResponse({"error": "Prompt parameter is missing"}, status=401)

    movie_data = MovieData.objects.filter(title=prompt).first()
    if movie_data:
        data = getattr(movie_data, field, '')
        if data:
            if request.user.is_authenticated:
                UserSearchRecord.objects.get_or_create(user=request.user, movie=movie_data)
            return JsonResponse({"status": 301, 'error_msg': '', 'data': data})

    with transaction.atomic():
        movie_data, created = MovieData.objects.select_for_update().get_or_create(title=prompt)
        if created or not getattr(movie_data, field, ''):
            client = ZhipuAI(api_key="a8bba26ff7a99355d1e5dacd004df505.Z75EPG6YPhkpl9tk")
            response = client.chat.completions.create(
                model="glm-4",
                messages=[
                    {"role": "user", "content": template.format(prompt)},
                ],
            )
            response_data = response.choices[0].message.content

            setattr(movie_data, field, response_data)
            movie_data.save()

            if request.user.is_authenticated:
                UserSearchRecord.objects.get_or_create(user=request.user, movie=movie_data)
            return JsonResponse({"status": 301, 'error_msg': '', 'data': response_data})
        else:
            data = getattr(movie_data, field, '')
            if request.user.is_authenticated:
                UserSearchRecord.objects.get_or_create(user=request.user, movie=movie_data)
            return JsonResponse({"status": 301, 'error_msg': '', 'data': data})

@csrf_exempt
@require_http_methods(["POST"])
def send_1(request):
    return get_movie_data(request, "请你将电影{}的创作背景概括并显示", 'background')

@csrf_exempt
@require_http_methods(["POST"])
def send_2(request):
    return get_movie_data(request, "请你将电影{}的剧情概括并显示", 'summary')

@csrf_exempt
@require_http_methods(["POST"])
def send_3(request):
    return get_movie_data(request, "请你将电影{}的演员导演名单概括并显示", 'cast')

@csrf_exempt
@require_http_methods(["POST"])
def send_4(request):
    return get_movie_data(request, "请你将电影{}的影片分析概括并显示", 'analysis')

@csrf_exempt
@require_http_methods(["POST"])
def send_5(request):
    return get_movie_data(request, "请你将电影{}的关键场景概括并显示", 'scenes')

@csrf_exempt
@require_http_methods(["POST"])
def send_6(request):
    return get_movie_data(request, "请你将电影{}的影评总结并显示", 'review')

@csrf_exempt
@require_http_methods(["POST"])
def send_7(request):
    return get_movie_data(request, "请你将电影{}的影片影响概括并显示", 'impact')
