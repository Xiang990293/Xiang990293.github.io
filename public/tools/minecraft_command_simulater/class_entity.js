const bintohex = "0123456789abcdef";

function random_hex(){
    return bintohex[Math.round(Math.random())*8+Math.round(Math.random())*4+Math.round(Math.random())*2+Math.round(Math.random())]
}

function uuid_gen(){
    return random_hex()+random_hex()+random_hex()+random_hex()+random_hex()+random_hex()+random_hex()+random_hex()+"-"+random_hex()+random_hex()+random_hex()+random_hex()+"-"+random_hex()+random_hex()+random_hex()+random_hex()+"-"+random_hex()+random_hex()+random_hex()+random_hex()+"-"+random_hex()+random_hex()+random_hex()+random_hex()+random_hex()+random_hex()+random_hex()+random_hex()+random_hex()+random_hex()+random_hex()+random_hex();
}

function hashcode(str) {
    var hash = 0, i, chr, len;
    if (str.length === 0) return hash;
    for (i = 0, len = str.length; i < len; i++){
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }

    return hash;
}

class entity_player{
    constructor(Entity, id){
        this.Entity = Entity;
        this.uuid = hashcode(id);
        this.id = id;
        this.gamemode = 0;
    }
    doReturnNBT(){
        return `{}`;
    }
}

class entity{
    constructor(Entity){
        this.Entity = Entity;
        this.UUID = uuid_gen();
        this.nbt = {
            
        }
    }
}