window.onload = function() {


const input = document.getElementById('inputKey')
const inputValue = document.getElementById('inputValue')
const output = document.getElementById('output')

document.querySelector('#button').onclick = function(){
    console.log('click')
    const key = input.value;
    const value = inputValue.value

    localStorage.setItem(key, value)
    location.reload()


    }

const key = localStorage.key(0);
const value = localStorage.getItem(key);
console.log(key, value)
output.innerHTML = key + ': ' + value



}