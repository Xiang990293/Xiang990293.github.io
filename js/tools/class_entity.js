const bintohex = "0123456789abcdef";

function random_hex(){
    return bintohex[Math.round(Math.random())*8+Math.round(Math.random())*4+Math.round(Math.random())*2+Math.round(Math.random())]
}

function uuid_gen(){
    return random_hex()+random_hex()+random_hex()+random_hex()+random_hex()+random_hex()+random_hex()+random_hex()+"-"+random_hex()+random_hex()+random_hex()+random_hex()+"-"+random_hex()+random_hex()+random_hex()+random_hex()+"-"+random_hex()+random_hex()+random_hex()+random_hex()+"-"+random_hex()+random_hex()+random_hex()+random_hex()+random_hex()+random_hex()+random_hex()+random_hex()+random_hex()+random_hex()+random_hex()+random_hex();
}

class entity_player{
    constructor(Entity, id){
        this.Entity = Entity;
        this.uuid = uuid_gen();
        this.id = id;
        this.gamemode = 0;
        this.nbt = {
            
        }
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