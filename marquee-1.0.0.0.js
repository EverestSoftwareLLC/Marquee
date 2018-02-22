/*
The MIT License (MIT) https://mit-license.org/

Copyright 2018 Everest Software LLC https://www.hmisys.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
associated documentation files (the “Software”), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, merge, publish, distribute, 
sub-license, and/or sell copies of the Software, and to permit persons to whom the Software is 
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial 
portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT 
NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES 
OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

Marquee = function(canvasID, options) {                          

 if ((typeof canvasID === "undefined") || (canvasID == '')) {
  alert("Marquee: Make sure to provide an id string.");
  return false;
 };

 this.canvasID = canvasID;

 if (typeof options === "undefined") 
  options = Object();
 
 this.cRef = {};
 this.ctx = {};
 this.userTextWidth = 0; 
 this.userTextWidth2 = 0;
 this.position = 0;
 
 this.backgroundColor = options.backgroundColor ? options.backgroundColor : "white";    //background color 
 this.borderColor = options.borderColor ? options.borderColor : "black";        //optional border color
 this.borderWidth = options.borderWidth ? options.borderWidth : 0;              //optional border 0 = no border
 this.fontColor = options.fontColor ? options.fontColor : "black";              //font color
 this.fontSize = options.fontSize ? options.fontSize : 20;                      //font size
 this.fontName = options.fontName ? options.fontName : "Verdana";               //font name
 this.imageSrc = options.imageSrc ? options.imageSrc : "";                      //optional background image
 this.userText = options.userText ? options.userText : "Everest Software LLC";  //marquee text
 this.speed = options.speed ? options.speed : 50;                               //frequency to step(move) text
 this.step = options.step ? options.step : 2;                                   //pixel count to move text per speed pulse
 this.direction = options.direction ? options.direction: 0;                     //0=r to l, 1=l to r, 3=u to d, 4=d to u
 this.paused = options.paused ? options.paused: false;                          //start active or paused
 this.bounce = options.bounce ? options.bounce: false;                          //reverse when edge hit
 
 this.cRef = document.getElementById(this.canvasID);                                  //a reference to the canvas
 if (this.cRef) {
  this.ctx = this.cRef.getContext("2d");
  this.cRef.width = this.cRef.offsetWidth;		 		
  this.cRef.height = this.cRef.offsetHeight; 
  }
 else
  return;

 this.marqueeWidth2 = this.cRef.width / 2;
 this.marqueeHeight2 = this.cRef.height / 2;

 if (this.imageSrc != "") {
  this.bgImg = new Image(this.cRef.width,this.cRef.height);
  this.bgImg.src = this.imageSrc;
  };

 this.CreateTimer = function(m, mills) {
  setTimeout(function() { m.TimerPulse(m)}, mills);
 };

 this.DrawMarquee = function() {

  if (typeof this.bgImg !== "undefined")  
   this.ctx.drawImage(this.bgImg, 0, 0,this.cRef.width,this.cRef.height)
  else {
   this.ctx.beginPath(); 
   this.ctx.rect(0,0,this.cRef.width,this.cRef.height);
   this.ctx.fillStyle=this.backgroundColor;
   this.ctx.fill();  
  };
      
  if (this.borderWidth > 0) {
   this.ctx.strokeStyle = this.borderColor;
 	this.ctx.lineWidth = this.borderWidth;
   this.ctx.strokeRect(0,0,this.cRef.width,this.cRef.height);
  };

  this.ctx.font = this.fontSize.toString() + "px " + this.fontName; //example 26px Verdana;
  this.ctx.fillStyle = this.fontColor;
  this.ctx.textBaseline="middle";                              
  switch(this.direction) {

   case 0:                      //right to left
   case 1:                      //left to right
    this.ctx.fillText(this.userText,this.position,this.marqueeHeight2);
    break;

   case 2:                      //up to down
   case 3:                      //down to up
    this.ctx.fillText(this.userText,(this.marqueeWidth2 - this.userTextWidth2), this.position);
    break;
  };            //end of switch
 };

 this.Initialize = function(m) {
  this.SetUserTextWidth();
  switch(this.direction) {

   case 0:                      //right to left
    this.position = this.cRef.width + 1;
    if (this.bounce)
     this.position = this.cRef.width - this.userTextWidth;
    break;

   case 1:                      //left to right
    this.position = (-this.userTextWidth);  
    if (this.bounce)
     this.position = 0;
    break;

   case 2:                      //up to down
    this.position = (-this.fontSize);  
    if (this.bounce)
     this.position = this.fontSize;
    break;

   case 3:                      //down to up
    this.position = (this.cRef.height + this.fontSize);  
    if (this.bounce)
     this.position = (this.cRef.height - this.fontSize) ;
    break;

  };                    //end of switch
  this.CreateTimer(m,1);
 };

 this.ResetStartPosition = function() {
//when the text reaches and edge it reset to start or reverse direction
  switch(this.direction) {

   case 0:                      //right to left
    if (this.bounce) 
     this.direction = 1    //flip direction
    else
     this.position = this.cRef.width;
    break;

   case 1:                      //left to right
    if (this.bounce) 
     this.direction = 0
    else
     this.position = (-this.userTextWidth);  
    break;

   case 2:                      //up to down
    if (this.bounce) 
     this.direction = 3  //flip direction                
    else
     this.position = (-this.fontSize);  
    break;

   case 3:                      //down to up
    if (this.bounce) 
     this.direction = 2                
    else
     this.position = (this.cRef.height + this.fontSize);  
    break;
 
  };                //end of switch
 };

 this.SetProperty = function (prop,newValue) {
  switch(prop) {
   case 'backgroundColor':
    this.backgroundColor = newValue;
    break;
   case 'borderColor':
    this.borderColor = newValue;
    break;
   case 'borderWidth':
    this.borderWidth = newValue;
    break;
   case 'bounce':
    this.bounce = newValue;
    break;
   case 'direction':
    this.direction = newValue;
    break;
   case 'fontColor':
    this.fontColor = newValue;
    this.SetUserTextWidth();
    break;
   case 'fontName':
    this.fontName = newValue;
    this.SetUserTextWidth();
    break;
   case 'fontSize':
    this.fontSize = newValue;
    this.SetUserTextWidth();
    break;
   case 'imageSrc':
    this.imageSrc = newValue;
    break;
   case 'paused':
    this.paused = newValue;
    break;
   case 'speed':
    this.speed = newValue;
    break;
   case 'step':
    this.step = newValue;
    break;
   case 'userText':
    this.userText = newValue;
    this.SetUserTextWidth();
    break;
   };           //end of switch
  };

 this.SetUserTextWidth = function() {
//when left to right or right to left the text width is needed.
  this.ctx.font = this.fontSize.toString() + "px " + this.fontName; //example 26px Verdana;
  this.ctx.fillStyle = this.fontColor;
  this.userTextWidth = this.ctx.measureText(this.userText).width;
  this.userTextWidth2 = this.userTextWidth / 2;
 };

 this.TimerPulse = function(m) {
  if (!m) 
   return;
  this.CreateTimer(m,m.speed);
  if (!m.paused) {
   m.UpdateTextPosition();
   m.DrawMarquee();
  };
 };

 this.UpdateTextPosition = function() {
// determine the next position for the text.
  switch(this.direction) {

   case 0:                      //right to left
    this.position = (this.position - this.step); 
    if ((this.position <= (-this.userTextWidth)) ||
       (this.bounce && (this.position <= 0))) 
     this.ResetStartPosition();
    break;

   case 1:                      //left to right
    this.position = (this.position + this.step); 
    if ((this.position >= this.cRef.width) || 
     (this.bounce && ((this.position + this.userTextWidth) >= this.cRef.width))) 
     this.ResetStartPosition();
    break;

   case 2:                      //up to down
    this.position = (this.position + this.step);
    if (((this.position - this.fontSize) >= this.cRef.height) || 
     (this.bounce && ((this.position + this.fontSize) >= this.cRef.height))) 
     this.ResetStartPosition();
    break;

   case 3:                      //down to up
    this.position = (this.position - this.step);
    if ((this.position <= -this.fontSize) || 
     (this.bounce && ((this.position - this.fontSize)  <= 0))) 
     this.ResetStartPosition();
    break;
  };                //end of switch
 };

};


