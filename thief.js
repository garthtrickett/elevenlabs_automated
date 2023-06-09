const { Builder, By, Key, until, options } = require("selenium-webdriver");
const chromeDriver = require('selenium-webdriver/chrome');
const axios = require('axios');
var fs = require('fs');
const path = require('path');
const lib = require("./vpn_ip_swapper.js");
const execSync = require('child_process').execSync;
const delay = ms => new Promise(res => setTimeout(res, ms));
const promisify = require('util').promisify;



// Function to check if a file with a specific extension exists in a directory
function checkFileWithExtension(dir, extension) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const fileFound = files.find((file) => path.extname(file) === extension);
        resolve(fileFound !== undefined);
      }
    });
  });
}


// Function to rename the first file with a specific extension in a directory
function renameFileWithExtension(dir, extension, newName) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const fileToRename = files.find((file) => path.extname(file) === extension);
        if (fileToRename) {
          const oldPath = path.join(dir, fileToRename);
          const newPath = path.join(dir, newName + extension);
          fs.rename(oldPath, newPath, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve(`File ${fileToRename} renamed to ${newName}${extension}`);
            }
          });
        } else {
          resolve(`No file with extension ${extension} found`);
        }
      }
    });
  });
}



// make it so if the script breaks it can look in the audio folder and find the highest number then start from there



try {
  var data = fs.readFileSync('input_text/consume.txt', 'utf8');
} catch (e) {
  console.log('Error:', e.stack);
}

// mp3wrap combined.mp3 *.mp3



const main = async () => {
  var book_character_length = data.length;
  var section_length = 2500;
  var end_section_character = 0;
  var start_section_character = 0;
  var section = 1;

  console.log("Book Character Length: " + book_character_length);

  var email = "";

  while (end_section_character < book_character_length) {
    // if (section > 6) {
    //   break
    // }

    if (!last_character) {
      end_section_character = section_length
    }
    else {
      start_section_character = last_character;
      end_section_character = last_character + section_length;
    }

    console.log("Section " + section);
    console.log(start_section_character);



    var last_character = data.slice(start_section_character, end_section_character).lastIndexOf(".");
    last_character = start_section_character + last_character;

    if (section == 1) {
      var offset = 0;
    }
    else {
      offset = 2;
    }



    text = data.slice(start_section_character + offset, last_character + 1);
    console.log(last_character);


    if (((section - 1) % 4 === 0) || (section == 1)) {
      const get_static_ip_result = await lib.get_static_ip()
    }




    email = await thief(text, section, email);


    section = section + 1

  }


}


main()

const get_driver = () => {

  var options = new chromeDriver.Options();
  options.setUserPreferences({
    "download.prompt_for_download": false,
    "download.default_directory": "~/files/code/naughty_books",
  });


  // options.addArguments('--headless');
  options.addArguments("--mute-audio");


  let driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  return driver;
}



const thief = async (text, section, email) => {
  var new_temp_email_needed = false;


  if (((section - 1) % 4 === 0) || (section == 1)) {
    new_temp_email_needed = true;
  }


  var driver = get_driver();



  if (new_temp_email_needed == true) {


    var elevenlabs_account_created = false;

    while (elevenlabs_account_created == false) {
      var result = await get_temp_email_and_try_login_create_elevenlabs_account(driver);
      elevenlabs_account_created = result[0];
      var temp_mail_window_handle = result[1];
      var elevenlabs_window_handle = result[2];
      email = result[3];
      driver = result[4];

    }

    await delay(2000);

    await driver.switchTo().window(temp_mail_window_handle);
    await driver.close();
    await driver.switchTo().window(elevenlabs_window_handle);
    var temp_email_url = "https://emailnator.com/inbox/#"
    temp_email_url = temp_email_url.concat(email);
    await driver.switchTo().newWindow('tab');
    await driver.get(temp_email_url);


    var emails_xpath = "/html/body/div/div/section/div/div/div[3]/div/div[2]/div[2]/div/table/tbody";
    var emails_loaded = false;
    while (emails_loaded == false) {
      var card_body_element_inner_text = await driver.wait(until.elementLocated(By.xpath(emails_xpath))).getAttribute("innerText");
      var card_body_element = await driver.wait(until.elementLocated(By.xpath(emails_xpath)));
      if (card_body_element_inner_text.includes("ElevenLabs") == true) {
        emails_loaded = true;


      }
      else {
        await delay(3000);
        var card_body_element = await driver.wait(until.elementLocated(By.className("card-body"))).getAttribute("innerText");
      }

    }


    let elements = await card_body_element.findElements(By.css("tr"));
    var email_clicked = false;
    for (let e of elements) {
      if (email_clicked == false) {
        var email_text = await e.getText();

        if (email_text.includes("ElevenLabs") == true) {
          await e.findElement(By.css("a")).click();
          email_clicked = true;
        }
      }
    }


    var email_link_xpath = "/html/body/div/div/section/div/div/div[3]/div/div/div[2]/div/div/p[3]/a";
    await driver.wait(until.elementLocated(By.xpath(email_link_xpath))).click();


    var sign_in_xpath = "/html/body/div[5]/div/div/div/div[2]/div/div/div[1]/div[2]/div/div/div[2]/span/span";
    await driver.wait(until.elementLocated(By.xpath(sign_in_xpath))).click();
  }
  else {

    await driver.get("https://beta.elevenlabs.io");

    var expand_three_line_xpath = "/html/body/div[3]/div[1]/div/div/div[2]/div[2]/button";
    await driver.wait(until.elementLocated(By.xpath(expand_three_line_xpath))).sendKeys(Key.RETURN);

    var sign_up_button_xpath = "/html/body/div[3]/div[1]/div[2]/div/div[2]/p/a";
    await driver.wait(until.elementLocated(By.xpath(sign_up_button_xpath))).sendKeys(Key.RETURN);


  }





  var sign_in_email_xpath = "/html/body/div[5]/div/div/div/div[2]/div/div/div[2]/div/form/div[2]/input";
  var sign_in_password_xpath = "/html/body/div[5]/div/div/div/div[2]/div/div/div[2]/div/form/div[3]/input";
  var login_button_xpath = "/html/body/div[5]/div/div/div/div[2]/div/div/div[2]/div/form/div[4]/button"

  await driver.wait(until.elementLocated(By.xpath(sign_in_email_xpath))).sendKeys(email, Key.RETURN);
  await driver.findElement(By.xpath(sign_in_password_xpath)).sendKeys("Bisonoh.123568", Key.RETURN, Key.RETURN);
  await driver.findElement(By.xpath(login_button_xpath)).click();



  var voice_button_select_xpath = "/html/body/div[3]/div[2]/div/div/div/form/div/div[1]/div[1]/div/button";
  await driver.wait(until.elementLocated(By.xpath(voice_button_select_xpath))).sendKeys(Key.RETURN);

  var voice_button_josh_xpath = "/html/body/div[3]/div[2]/div/div/div/form/div/div[1]/div[1]/div/ul/li[7]";
  await driver.wait(until.elementLocated(By.xpath(voice_button_josh_xpath))).sendKeys(Key.RETURN);



  console.log(text);

  var text_input_area_xpath = "/html/body/div[3]/div[2]/div/div/div/form/div/div[4]/div[1]/textarea";
  await driver.wait(until.elementLocated(By.xpath(text_input_area_xpath))).sendKeys(text, Key.RETURN);

  var submit_generate_text_xpath = "/html/body/div[3]/div[2]/div/div/div/form/div/div[4]/div[1]/button";
  await driver.wait(until.elementLocated(By.xpath(submit_generate_text_xpath))).sendKeys(Key.RETURN);


  await driver.wait(until.elementIsEnabled(driver.findElement(By.xpath(submit_generate_text_xpath))), 150000);

  var download_button_xpath = "/html/body/div[2]/div[2]/div[2]/div[2]/div[3]/button[1]";
  await driver.wait(until.elementLocated(By.xpath(download_button_xpath))).sendKeys(Key.RETURN);




  const dir = process.cwd(); // Current working directory
  const extension = '.mp3';

  var file_exists = false;

  console.log(1111);

  while (file_exists == false) {
    checkFileWithExtension(dir, extension)
      .then((exists) => file_exists = true)
      .catch((error) => file_exists = false)
    await delay(1000);
  }

  console.log(2222);


  var new_file_name = "audio/" + section;
  renameFileWithExtension(dir, extension, new_file_name)
    .then((message) => console.log(message))
    .catch((error) => console.error('Error:', error));

  console.log(3333);
  driver.quit()

  return email;

}




const get_temp_email_and_try_login_create_elevenlabs_account = async (driver) => {


  await driver.get("https://www.emailnator.com");

  var cookie_xpath = "/html/body/div/div/div/p/button";
  await driver.wait(until.elementLocated(By.xpath(cookie_xpath))).sendKeys(Key.RETURN);


  email_path = "/html/body/div/div/main/div[1]/div/div/div/div[2]/div/div[1]/input";
  let email_is_gmail = false;
  while (email_is_gmail == false) {


    var email = await driver.wait(until.elementLocated(By.xpath(email_path))).getAttribute("value");

    console.log("email: " + email);
    if (email.includes("@gmail.com") == true && email.includes("+") == false) {
      email_is_gmail = true;
    }
    else {
      await driver.navigate().refresh();
      await delay(1000);
    }
  }

  let go_path = "/html/body/div[1]/div/main/div[1]/div/div/div/div[2]/div/div[3]/button";
  await driver.findElement(By.xpath(go_path)).click();
  const temp_mail_window_handle = await driver.getWindowHandle();


  // Opens a new tab and switches to new tab
  await driver.switchTo().newWindow('tab');
  await driver.get("https://beta.elevenlabs.io/sign-up");


  await driver.wait(until.elementLocated(By.xpath("/html/body/div[3]/div[2]/div/div/div[2]/div/div/div[2]/form/div[1]/div/input"))).sendKeys(email, Key.RETURN);
  await driver.findElement(By.xpath("/html/body/div[3]/div[2]/div/div/div[2]/div/div/div[2]/form/div[2]/div/input")).sendKeys("Bisonoh.123568", Key.RETURN);
  let checkbox_xpath = "/html/body/div[3]/div[2]/div/div/div[2]/div/div/div[2]/form/div[3]/input";
  await driver.findElement(By.xpath(checkbox_xpath)).click();

  let submit_path = "/html/body/div[3]/div[2]/div/div/div[2]/div/div/div[2]/form/div[5]/button";
  await driver.findElement(By.xpath(submit_path)).click();



  let outcome_text = await driver.wait(until.elementLocated(By.xpath("/html/body/div[1]/div/div/div[1]/div/span"))).getAttribute("innerText");

  let outcome = outcome_text.includes("gmail");
  const elevenlabs_window_handle = await driver.getWindowHandle();

  if (outcome == false) {
    await driver.quit();

    var driver = get_driver();

  }

  return [outcome, temp_mail_window_handle, elevenlabs_window_handle, email, driver];



}






