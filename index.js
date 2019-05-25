var im = undefined

$(document).ready(function() {
    im = Immuto.init(true, "https://dev.immuto.io")
})

async function submit_file() {
    name = $("#name-input").val()
    desc = $("#description-input").val()
    file = document.getElementById('file-input').files[0]
    email = $("#email-input").val()
    password = $("#password-input").val()
    type = 'basic'
    $("#submit-button").attr('disabled', true)


    if (!(name && file && password && email)) {
        display_error("Please complete all the required fields")
        $("#submit-button").attr('disabled', false)
        return
    }

    try {
        console.log("Running file record tests:")
        if (!im.authToken) /* User not yet authenticated */
            await im.authenticate(email, password)
        console.log("User authenticated.")

        let fileContent = await get_file_content(file)
        console.log("Parsed file content.")

        let recordID = await im.create_data_management(fileContent, 'File Record', type, password, desc)
        console.log("Successfully created file record:", recordID) 

        let verification = await im.verify_data_management(recordID, 'basic', fileContent)
        if (verification === false) {
                console.error("File record verification failed :(")
        } else {
                console.log("File record verification successful!")
                console.log(verification)
        }      
        alert("Tests completed. See console for results.")
        $("#submit-button").attr('disabled', false)

    } catch(err) {
        console.error(err)
        alert("Error during tests. See console for results.")
        $("#submit-button").attr('disabled', false)
    }

}

function get_file_content(file) {
    return new Promise((resolve, reject) => {         
        var reader = new FileReader();
        reader.onload = function() {
            let fileContent = this.result
            resolve(new Uint8Array(fileContent).toString())
        }
        reader.readAsArrayBuffer(file);
    })
}

function display_error(error) {
    alert(error)
}