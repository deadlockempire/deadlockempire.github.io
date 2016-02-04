var IntegerVariable = function (name, defaultValue) {
    this.name = name;
    this.type = "System.Int32";
    this.value = defaultValue;
};
var CountdownEventVariable = function (name, count) {
    this.name = name;
    this.type = "System.Threading.CountdownEvent";
    this.value = count;
};