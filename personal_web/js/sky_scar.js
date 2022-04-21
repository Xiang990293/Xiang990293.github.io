function fit_screen(){
    var windows_width = window.innerWidth;
    var windows_height = window.innerHeight;
    var thick = 0.65;
    var border_px = 5;

    document.getElementById("Edge").style.border = `${border_px}px solid white`;
    document.getElementById("innerEdge").style.border = `${border_px}px solid white`;

    if (windows_height > windows_width){
        document.getElementById("Edge").style.height = `${(windows_width-border_px*2)}px`;
        document.getElementById("Edge").style.width = `${(windows_width-border_px*2)}px`;
        document.getElementById("innerEdge").style.height = `${(windows_width-border_px*2)*thick}px`;
        document.getElementById("innerEdge").style.width = `${(windows_width-border_px*2)*thick}px`;

    }else if (windows_height < windows_width){
        document.getElementById("Edge").style.height = `${(windows_height-border_px*2)}px`;
        document.getElementById("Edge").style.width = `${(windows_height-border_px*2)}px`;
        document.getElementById("innerEdge").style.height = `${(windows_height-border_px*2)*thick}px`;
        document.getElementById("innerEdge").style.width = `${(windows_height-border_px*2)*thick}px`;
    }else{
        document.getElementById("Edge").style.height = `${(windows_width-border_px*2)}px`;
        document.getElementById("Edge").style.width = `${(windows_width-border_px*2)}px`;
        document.getElementById("innerEdge").style.height = `${(windows_width-border_px*2)*thick}px`;
        document.getElementById("innerEdge").style.width = `${(windows_width-border_px*2)*thick}px`;
    }
    setTimeout('fit_screen()',1);
}