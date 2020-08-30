var swipeElement = document.getElementById("swipeProduct");
var buttonElement = document.getElementById("showProductsListButton");

var hammerswipe = new Hammer(swipeElement);

var modal = $modal({
    title: 'Your shopping list',
    content: '',
    footerButtons: [
        { class: 'btn btn__ok', text: 'OK', handler: 'modalHandlerOk' }
    ]
});

let checkProductList = []
let productList = ["Some Product One", "Some Product Two", "Some Product Three", "Some Product Four", "Some Product Five", "Some Product Six"]
let nowProductIndex = 0

swipeElement.innerText = productList[nowProductIndex];

hammerswipe.on("swipe", (e) => {

    if(e.deltaX > 0) {
        checkProductList.push(swipeElement.innerText);
    }

    if(nowProductIndex == productList.length-1) {
        document.onmousemove = null;
        swipeElement.style.left = "0";
        swipeElement.style.top = "0";
        swipeElement.innerText = "That's all from your shopping list!";
        swipeElement = null;
        hammerswipe = null;
        buttonElement.style.display = "block";
        return;
    }
    nowProductIndex++;
    swipeElement.innerText = productList[nowProductIndex];
})

buttonElement.onmousedown = (e) => {
    let allText = '<div>';
    checkProductList.forEach(element => {
        allText += element;
        allText += "<br />"
    });
    allText += "</div>";
    modal.setContent(allText);
    modal.show()
}

swipeElement.onmousedown = (e) => {
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
    document.onmousemove = null;
    swipeElement.style.left = "0";
    swipeElement.style.top = "0";
}

document.addEventListener('click', (e) => {
    if(e.target.dataset.handler === "modalHandlerOk") {
        modal.hide();
    }
})