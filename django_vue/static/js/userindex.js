var username;
var datalist;
var get_sumup_res = false;

window.onload = function (){
    console.log(username);
    get_sumup(username);
    if (get_sumup_res) {
        setup_table(datalist);
    } else {
        console.log('onload can not load table');
    }
}

function delete_one_video(bvid, username){
    console.log('delete_one_video');
    console.log(bvid);
    console.log(username);
}
function finish_one_video(bvid, username){
    console.log('finish_one_video');
    console.log(bvid);
    console.log(username);
    data = {
        'bvid': bvid,
        'username': username,
    }
    $.ajax({
        url: '/userindex/finish_one_video',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            console.log(response);
            alert('标记完成成功');
            window.location = '/userindex';
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('An error occurred: ', jqXHR.responseText);
            if (jqXHR.status == 400) {
                alert('上传失败，记录不存在，即将返回主页...');
                window.location = '/';
            } else if (jqXHR.status == 401) {
                alert('上传失败，记录已被删除，即将返回主页...');
            } else if (jqXHR.status == 402) {
                alert('上传失败，记录已被标记为完成，即将返回主页...');
            }
        }
    });
}

function generate_table_row(dataitem) {
    var tr = document.createElement('tr');
    var td_bvid = document.createElement('td');
    td_bvid.innerHTML = dataitem['bvid'];
    var td_oridur = document.createElement('td');
    td_oridur.innerHTML = dataitem['oridur'];
    var td_finaldur = document.createElement('td');
    td_finaldur.innerHTML = dataitem['finaldur'];
    var td_process_status = document.createElement('td');
    td_process_status.innerHTML = dataitem['process_status'] ? "&#x2705" : "&#x274C";
    var td_anno_status = document.createElement('td');
    td_anno_status.innerHTML = String(dataitem['anno_count']) + '/' + String(dataitem['total_count'])
    var td_finished = document.createElement('td');
    td_finished.innerHTML = dataitem['finished'] ? "&#x2705" : "&#x274C";
    var td_paid = document.createElement('td');
    td_paid.innerHTML = dataitem['paid'] ? "&#x2705" : "&#x274C";
    var td_goto_anno = document.createElement('td');
    if (dataitem['anno']){
        bvid = dataitem['bvid'];
        var button_goto_anno = document.createElement('button');
        button_goto_anno.setAttribute("onclick", `window.location.href='/anno_bilibili?bvid=${bvid}'`)
        button_goto_anno.setAttribute("style", "width:30px;height:30px;background-color:green");
        td_goto_anno.appendChild(button_goto_anno);
    } else {
        td_goto_anno.innerHTML = 'n/a';
    }
    var td_goto_delete = document.createElement('td');
    if (dataitem['delete']){
        bvid = dataitem['bvid'];
        var button_goto_delete = document.createElement('button');
        button_goto_delete.setAttribute("onclick", `delete_one_video('${bvid}', '${username}')`);
        button_goto_delete.setAttribute("style", "width:30px;height:30px;background-color:red");
        td_goto_delete.appendChild(button_goto_delete);
    } else {
        td_goto_delete.innerHTML = 'n/a';
    }
    var td_goto_finish = document.createElement('td');
    if (dataitem['finish']){
        bvid = dataitem['bvid'];
        var button_goto_finish = document.createElement('button');
        button_goto_finish.setAttribute("onclick", `finish_one_video('${bvid}', '${username}')`);
        button_goto_finish.setAttribute("style", "width:30px;height:30px;background-color:cyan");
        td_goto_finish.appendChild(button_goto_finish);
    } else {
        td_goto_finish.innerHTML = 'n/a';
    }

    tr.appendChild(td_bvid);
    tr.appendChild(td_process_status);
    tr.appendChild(td_anno_status);
    tr.appendChild(td_finished);
    tr.appendChild(td_paid);
    tr.appendChild(td_oridur);
    tr.appendChild(td_finaldur);
    tr.appendChild(td_goto_anno);
    tr.appendChild(td_goto_delete);
    tr.appendChild(td_goto_finish);
    return tr;
}

function setup_table(datalist) {
    e_table = document.getElementById('datatable');
    datalist.forEach(element => {
        tr = generate_table_row(element);
        e_table.appendChild(tr);
    });
}

function get_sumup(username){
    $.ajax({
        url: `/userindex/get_sumup?username=${username}`,
        type: 'GET',
        async: false,
        success: function(data) {
            console.log(data);
            datalist = data;
            get_sumup_res = true;
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('An error occurred: ', jqXHR.responseText);
            get_sumup_res = false;
        }
    });
}