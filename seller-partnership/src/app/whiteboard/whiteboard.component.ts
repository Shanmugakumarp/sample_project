import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { fabric } from 'fabric';
import $ from "jquery";
import { Router }                                    from '@angular/router';

@Component({
  selector: 'app-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.css']
})
export class WhiteboardComponent implements OnInit, AfterViewInit {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  userData: Object = { name: '', pwd: '' };
  canvas: any;
  type: any = '';

  constructor(private http: HttpClient, private router: Router) {

  }

  ngAfterViewInit() {    
  }

  ngOnInit() {
    let self = this;
    self.canvas = new fabric.Canvas('paper', { selection: false });
    self.canvas.setHeight(window.innerHeight);
    self.canvas.setWidth(window.innerWidth-100);

    this.http.get('/getData', this.httpOptions).subscribe((res) => {
      if (res && res['canvas_data'])
        this.canvas.loadFromJSON(res['canvas_data'], this.canvas.renderAll.bind(this.canvas));
    });

    $("#selec").click(function () {
      self.canvas.isDrawingMode = false;
      self.canvas.selection = true;
      self.type = '';
      //  self.canvas.off('mouse:down');
       self.canvas.off('mouse:move');
       self.canvas.off('mouse:up');
    });

    var type, isDown, origX, origY;
    self.canvas.observe('mouse:down', function (o) {
      if(!self.type)
        return;

      self.canvas.isDrawingMode = false;
      self.canvas.freeDrawingBrush.width = 0;
      let pointer = self.canvas.getPointer(o.e);
      let points = [pointer.x, pointer.y, pointer.x, pointer.y];
      origX = pointer.x;
      origY = pointer.y;
      
      self.canvas.on('mouse:up', function (o) {
        isDown = false;
      });
      
      self.canvas.observe('mouse:move', function (o) {
        self.canvas.selection = false;
        if (!isDown) return;
        var pointer = self.canvas.getPointer(o.e);
        type.set({ width: Math.abs(origX - pointer.x), height: Math.abs(origY - pointer.y) });
        self.canvas.renderAll();
      });
      
      isDown = true;
      switch (self.type) {
        case 'triangle':
          type = new fabric.Triangle({
            left: pointer.x,
            top: pointer.y,
            strokeWidth: 1,
            width: 2, height: 2,
            stroke: '#F67E7D',
            fill: '',
            //selectable: true,
            originX: 'center'
          });
          self.canvas.add(type);
          break;
        case 'circle':
          type = new fabric.Circle({
            left: pointer.x,
            top: pointer.y,
            strokeWidth: 1,
            radius: 25,
            stroke: '#F67E7D',
            fill: '',
            //selectable: true,
            originX: 'center'
          });
          self.canvas.add(type);
          break;
        case 'square':
          type = new fabric.Rect({
            left: pointer.x,
            top: pointer.y,
            strokeWidth: 1,
            width: 2, height: 2,
            stroke: '#F67E7D',
            fill: '',
            //selectable: true,
            originX: 'center'
          });
          self.canvas.add(type);
          break;
        case 'line':
          type = new fabric.Line(points, {
            strokeWidth: 1,
            fill: '#F67E7D',
            stroke: '#F67E7D',
            originX: 'center',
            originY: 'center'
          });
          self.canvas.add(type);
          break;
        case 'freestyle':
          self.canvas.off('mouse:move');
          self.canvas.off('mouse:up');
          this.type = '';
          self.canvas.isDrawingMode = true;
          self.canvas.freeDrawingBrush.color = "#F67E7D";
          self.canvas.freeDrawingBrush.width = 1;
          break;
      }
    });
  }
  
  onSelection(_type) {
     this.type = _type;
  }

  deleteObjects() {
    var activeObject = this.canvas.getActiveObject();
    let self = this;
    if (activeObject && activeObject._objects && activeObject._objects.length > 1) {
      if (confirm('Are you sure?')) {
        activeObject._objects.forEach(function (object) {
          self.canvas.remove(object);
        });
      }
    } else if (activeObject) {
      if (confirm('Are you sure?')) {
        this.canvas.remove(activeObject);
      }
    }
  }

  saveData() {

    return this.http.post('/saveData', this.canvas.toJSON(), this.httpOptions).subscribe((res) => {
        console.log(res);
      });
  }

  logOut() {
    this.router.navigate(['/']);
  }

}
