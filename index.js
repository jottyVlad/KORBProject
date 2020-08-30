var swipeElement = document.getElementById("swipeProduct");
var buttonProductListElement = document.getElementById("showProductsListButton");
var buttonProductFromChooseElement = document.getElementById("showFromChoosePrList");
var buttonsRemoveElement = document.getElementsByClassName("remove_element");

var hammerswipe = new Hammer(swipeElement);

var modalEnd = $modal({
    title: 'Your shopping list',
    content: '',
    footerButtons: [
        { class: 'btn btn__ok', text: 'OK', handler: 'modalHandlerOk' }
    ]
});

var modalChoosing = $modal({
    title: 'From choosing list',
    content: '',
    footerButtons: [
        { class: 'btn btn__append', text: '+', handler: 'modalChoosingHandlerAppend' },
        { class: 'btn btn__ok', text: 'OK', handler: 'modalChoosingHandlerOk' }
    ]
});

let goNext = false;

let checkProductList = []
let nowProductIndex = 0

let productList = [];

const reloadProductList = () => {
    productList = localStorage.getItem('products');
    if(productList === null) {
        document.onmousemove = null;
        swipeElement.style.left = "0";
        swipeElement.style.top = "0";
        swipeElement.innerText = "None in your shopping list";
    } else {
        nowProductIndex = 0;
        checkProductList = [];
        productList = productList.split(',')
        swipeElement.innerText = productList[nowProductIndex];
        goNext = true;
    }
} 

reloadProductList();

hammerswipe.on("swipe", (e) => {


    if(goNext === false)
        return;

    if(e.deltaX > 0) {
        checkProductList.push(swipeElement.innerText);
    }

    if(nowProductIndex == productList.length-1) {
        document.onmousemove = null;
        swipeElement.style.left = "0";
        swipeElement.style.top = "0";
        swipeElement.innerText = "That's all from your shopping list!";
        buttonProductListElement.style.display = "block";
        return;
    }
    nowProductIndex++;
    swipeElement.innerText = productList[nowProductIndex];
})

buttonProductListElement.onmousedown = (e) => {
    let allText = '<div>';
    checkProductList.forEach(element => {
        allText += element;
        allText += "<br />"
    });
    allText += "</div>";
    modalEnd.setContent(allText);
    modalEnd.show()
}

let containerText = '';

const containerTextReload = () => {
    containerText = '';
    productList.forEach(element => {
        containerText += "<div><input type='text' value='"+element+"' class='input_element' /><span class='remove_element' id='remove_"+element+"'>-</span></div>"
    });
    modalChoosing.setContent(containerText);
}

buttonProductFromChooseElement.onmousedown = (e) => {
    containerTextReload();
    modalChoosing.show();
}

swipeElement.onmousedown = (e) => {
    if(goNext === false) 
        return;
    var left = parseInt( window.getComputedStyle(swipeElement).getPropertyValue("left") );
    var top = parseInt( window.getComputedStyle(swipeElement).getPropertyValue("top") );
    var mouseX = e.clientX;
    var mouseY = e.clientY;

    document.onmousemove = (e) => {
        var dx = mouseX - e.clientX;
        var dy = mouseY - e.clientY;

        swipeElement.style.left = left - dx + "px";
        swipeElement.style.top = top - dy + "px";
    };
}

swipeElement.onmouseup = () => {
    if(goNext === false)
        return;
    document.onmousemove = null;
    swipeElement.style.left = "0";
    swipeElement.style.top = "0";
}

document.addEventListener('click', (e) => {
    if(e.target.id.startsWith("remove_")) {
        var element = e.target.id.replace("remove_", '');
        for(var i = 0; i < productList.length; i++) {
            if(productList[i] === element) {
                productList.splice(i, 1);
                break;
            }
        }
        containerTextReload();
    }
    if(e.target.dataset.handler === "modalHandlerOk") {
        modalEnd.hide();
    } else if(e.target.dataset.handler == "modalChoosingHandlerAppend") {
        containerText += "<div><input type='text' class='input_element' /><span class='remove_element' id='remove_'>-</span></div>";
        modalChoosing.setContent(containerText);
        buttonsRemoveElement = document.getElementsByClassName("remove_element");
        productList.push('');
    } else if(e.target.dataset.handler == "modalChoosingHandlerOk") {
        var inputs = document.getElementsByClassName("input_element");
        var values = []
        for(var i = 0; i < inputs.length; i++) {
            if(inputs[i].value === "")
                return;
            values.push(inputs[i].value);
        }

        var valuesSet = new Set(values);
        if(valuesSet.size !== values.length)
            return;
        
        localStorage.setItem('products', values.toString());
        reloadProductList();
        modalChoosing.hide();
    }
});