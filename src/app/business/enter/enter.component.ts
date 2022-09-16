import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { GlobalALert, GlobalFinal } from '../../dto-model/dto-model.component';
@Component({
  selector: 'app-enter',
  templateUrl: './enter.component.html',
  styleUrls: ['./enter.component.scss'],
})
export class EnterComponent implements OnInit {
  //身份证号
  id: string;
  //姓名
  name: string;
  //图片文件
  file = null;
  //图片路径
  hdsrc;
  //查看图片详情标识
  isSee = false;
  //是否禁用页面
  disabled = false

  constructor(private hr: HttpClient, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    //监听文件上传
    let input = document.getElementById("hd");
    //调用upload
    input.addEventListener("change", () => { this.upload(input) });
  }

  // 上传图像,obj是input
  upload(obj) {
    //创建相机操作对象
    const op: CameraOptions = {
      quality: 90,//图片质量
      destinationType: Camera.DestinationType.FILE_URI,//图片类型，使用图片路径
      encodingType: Camera.EncodingType.JPEG,//图片类型
      mediaType: Camera.MediaType.PICTURE//照相媒体，使用手机公共相机
    }
    //通过camera获取图片
    Camera
      .getPicture(op)
      .then((imgData) => {

      }, (err) => {
        //如果获取失败，我们就调用网页版上传
        this.file = obj.files[0];
        this.hdsrc = URL.createObjectURL(this.file);
        document.getElementsByTagName("ion-img")[0].setAttribute("src", this.hdsrc);
      })
  }

  //查看图片
  see() {
    if (this.hdsrc != null) {
      //将页面内容隐藏
      document.getElementsByTagName("ion-content")[0].setAttribute("hidden", "true");
      //展示图片
      this.isSee = true;
    }
  }

  //取消图片显示
  noSee() {
    //删除隐藏，重新显示
    document.getElementsByTagName("ion-content")[0].removeAttribute("hidden");
    //隐藏图片
    this.isSee = false;
  }

  //提交信息
  submitData() {
    //先通过加桌布控件的方式禁用整个页面
    this.disabled = true;
    //检测信息完整
    if (this.file == null || this.id == null || this.name == null) {
      GlobalALert.getAlert({ message: "请完整填写信息" });
      this.disabled = false;
    }
    let formdata = new FormData();
    formdata.append("file", this.file, this.file.name);
    formdata.append("sellerId", this.id);
    formdata.append("sellerName", this.name);
    try {
      this.hr.post(GlobalFinal.SELLER_DOMAIN + "/seller/enter", formdata, GlobalFinal.JWTHEADER)
        .subscribe((data: any) => {
          //输出信息
          GlobalALert.getAlert({ message: data.msg });
          //确定页面跳转
          if (data.stausCode == 200 || data.stausCode == 301) {
            //跳转页面初始化店铺
            this.router.navigateByUrl("/business/store/welcome");
          } else {
            this.disabled = false;
          }
        });
    } catch (error) {
      GlobalALert.getAlert({ message: "网络错误，请检查网络" });
      this.disabled = false;
    }
  }

  //桌布提示信息
  tip() {
    GlobalALert.getAlert({ message: "实名认证中，请等待" });
  }

}
