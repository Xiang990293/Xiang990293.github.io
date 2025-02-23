function textReader(input){
    let fileReader = new FileReader();
    fileReader.readAsText("Xiang990293.txt");
    fileReader.error = function(){
        alert(fileReader.error);
    }
    
    return fileReader.result;
}