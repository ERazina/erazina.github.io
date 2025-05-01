console.log(1 + "2"); 
console.log(true + "3"); 
console.log([] + []); 
console.log([] + {}); 
console.log({} + []); 

console.log("5" - 2); 
console.log("10" * "2");
console.log("6" / "3"); 
console.log("7px" - 2); 

console.log(Boolean(0)); 
console.log(Boolean("")); 
console.log(Boolean(" "));
console.log(Boolean([])); 
console.log(Boolean({}));


console.log(+"123"); 
console.log(+true); 
console.log(+false); 
console.log(+""); // 0
console.log(+"abc"); // NaN

console.log(!!"hello"); // true
console.log(!!0); // false
console.log(!![]); // true
console.log(!!null); // false