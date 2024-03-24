const REGEXP_PREFIXES = /^([,([{*<"“'`‘]|\.{1,3})/gi;
const string = "(name)";
const results = string.split(REGEXP_PREFIXES);
console.log(results);
