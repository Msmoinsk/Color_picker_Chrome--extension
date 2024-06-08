const colorPickerBtn = document.querySelector("#color-picker")
const colorList = document.querySelector(".all-colors")
const clearAll = document.querySelector(".clear-all")
const pickedColor = JSON.parse(localStorage.getItem("picked-colors") || "[]")

const copyColor = (event) => {
    navigator.clipboard.writeText(event.dataset.color)
    event.innerHTML = "Copied"
    // Its the revarsal as the textcontent has changed it need to be put back.
    setTimeout(()=>{event.innerHTML = event.dataset.color}, 1000)
}

// Generate the color code nad show it to the UI
const showColors = () => {
    if(!pickedColor.length) return  // Returning if there are no picked colors
    colorList.innerHTML = pickedColor.map(color => `
        <li class="color">
            <span class="rect" style="background: ${color}; border: 1px solid ${color == "#ffffff" ? "#ccc" : color}"></span>
            <span class="value" data-color="${color}">${color}</span>
        </li>
    `).join("")  // Generating the li for the picked color and adding it to the colorlist

    // show if any color been selected
    document.querySelector(".picked-colors").classList.remove("hide")
    // Add a click event Listener to each color Li Define Element Above to copy the color code
    document.querySelectorAll(".color").forEach(li => {
        li.addEventListener("click", e => copyColor(e.currentTarget.lastElementChild))
    })
}
showColors()

// This is to convert the rgba value to the Hexadecimal
function rgbaToHex(rgbaString) {
    // Extracting the values from the rgbaString
    const rgbaArray = rgbaString.match(/\d+/g).map(Number);

    // Converting RGBA values to hexadecimal
    const [r, g, b] = rgbaArray;
    // const alphaHex = Math.round(a * 255).toString(16).padStart(2, '0');
    const rHex = r.toString(16).padStart(2, '0');
    const gHex = g.toString(16).padStart(2, '0');
    const bHex = b.toString(16).padStart(2, '0');

    // Constructing the hexadecimal color string
    return `#${rHex}${gHex}${bHex}`;
}

// Activate the Color picker and fetch the color pickedd by user and store it in localstorage
const activateEyeDropper = () => {
    document.body.style.display = "none"
    setTimeout(async () => {
        try{
            const eyeDropper = new EyeDropper();
            const { sRGBHex } = await eyeDropper.open();
            const hex = rgbaToHex(sRGBHex)
    
            // Adding color to the list if it doesn't already exist
            if(!pickedColor.includes(hex)){
                pickedColor.push(hex)
                localStorage.setItem("picked-colors", JSON.stringify(pickedColor))
    
                showColors()
            }
    
        }catch (error) {
            console.log("Failed to copy the color code")
        }
        document.body.style.display = "block"
    }, 50)
}

// Clearing all picked colors, updating localstorage and hiding the picked colors element
const clearAllColor = () => {
    pickedColor.length = 0
    localStorage.setItem("picked-colors", JSON.stringify(pickedColor))
    // hide when all the color cleared
    document.querySelector(".picked-colors").classList.add("hide")

}

clearAll.addEventListener("click", clearAllColor)
colorPickerBtn.addEventListener("click", activateEyeDropper)