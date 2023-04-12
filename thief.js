const { Builder, By, Key, until, options } = require("selenium-webdriver");
const chromeDriver = require('selenium-webdriver/chrome');
const axios = require('axios');
var fs = require('fs');
const lib = require("./vpn_ip_swapper.js");
const execSync = require('child_process').execSync;
const delay = ms => new Promise(res => setTimeout(res, ms));
const promisify = require('util').promisify;







try {
  var data = fs.readFileSync('ethnic_phenomenon.txt', 'utf8');
} catch (e) {
  console.log('Error:', e.stack);
}

// TODO
// Figure out how to find the end of a sentence on the text
// repeat the max 2400 slice 4 times then run thief again
// mp3wrap combined.mp3 *.mp3
const main = async () => {
  var book_character_length = data.length;
  var section_length = 2500;
  var end_section_character = 0;
  var start_section_character = 0;
  var section = 1;

  console.log("Book Character Length: " + book_character_length);

  while (end_section_character < book_character_length) {
    if (section > 1) {
      break
    }

    if (!last_character) {
      end_section_character = section_length
    }
    else {
      start_section_character = last_character;
      end_section_character = last_character + section_length;
    }

    console.log("Section " + section);
    // console.log(start_section_character);
    // console.log(end_section_character);



    var last_character = data.slice(start_section_character, end_section_character).lastIndexOf(".");
    last_character = start_section_character + last_character;

    // console.log(data.slice(start_section_character + 2, last_character));
    text = data.slice(start_section_character + 2, last_character);


    const get_static_ip_result = await lib.get_static_ip()

    const thief_result = await thief(text, section)


    section = section + 1

  }


}


main()





const thief = async (text, section) => {
  var elevenlabs_account_created = false;

  while (elevenlabs_account_created == false) {
    var result = await get_temp_email_and_try_login_create_elevenlabs_account();
    var temp_mail_window_handle = result[1];
    var elevenlabs_window_handle = result[2];
    var email = result[3];
    var driver = result[4]
    elevenlabs_account_created = result[0];

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


  var sign_in_email_xpath = "/html/body/div[5]/div/div/div/div[2]/div/div/div[2]/div/form/div[2]/input";
  var sign_in_password_xpath = "/html/body/div[5]/div/div/div/div[2]/div/div/div[2]/div/form/div[3]/input";

  await driver.wait(until.elementLocated(By.xpath(sign_in_email_xpath))).sendKeys(email, Key.RETURN);
  await driver.findElement(By.xpath(sign_in_password_xpath)).sendKeys("Bisonoh.123568", Key.RETURN, Key.RETURN);

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
  await driver.wait(until.elementLocated(By.xpath(download_button_xpath))).sendKeys(Key.RETURN, Key.RETURN);


  var file_name = "audio/" + section + ".mp3"

  while (!fs.existsSync("synthesized_audio.mp3")) {
    await delay(1000);
  }

  fs.rename('synthesized_audio.mp3', file_name, function(err) {
    if (err) throw err;
    console.log('File Renamed.');
  });

  // elevenlabs api

  // var profile_button_xpath = "/html/body/div[3]/div[1]/div/div/div[2]/div[3]/div/button";

  // await driver.wait(until.elementLocated(By.xpath(profile_button_xpath))).click();

  // var profile_link_xpath = "/html/body/div[3]/div[1]/div/div/div[2]/div[3]/div[2]/div[2]/a[1]";

  // await driver.wait(until.elementLocated(By.xpath(profile_link_xpath))).click();

  // var uncover_api_key_button_xpath = "/html/body/div[4]/div/div/div/div[2]/div/div/div/div[2]/div/div[2]/div/button[1]";

  // await driver.wait(until.elementLocated(By.xpath(uncover_api_key_button_xpath))).click();


  // var api_key_text_field_element_xpath = "/html/body/div[4]/div/div/div/div[2]/div/div/div/div[2]/div/div[2]/div/div/input";

  // var xi_api_key = await driver.wait(until.elementLocated(By.xpath(api_key_text_field_element_xpath))).getAttribute("value");

  // driver.quit();
  // var voice_id = "TxGEqnHWrfWFTfGW9XjX";
  // var file_name = "audio" + section + ".mp3";
  // console.log(text);

  // try {
  //   var voice = "https://api.elevenlabs.io/v1/text-to-speech/" + voice_id + "/stream";
  //   const response = await axios({
  //     method: 'post',
  //     url: voice,
  //     data: { text },
  //     headers: {
  //       'Accept': 'audio/mpeg',
  //       'xi-api-key': xi_api_key,
  //       'Content-Type': 'application/json',
  //     },
  //     responseType: 'stream'
  //   });
  //   response.data.pipe(fs.createWriteStream(file_name));
  // } catch (error) {
  //   console.error(error);
  // }

  return true;


}




const get_temp_email_and_try_login_create_elevenlabs_account = async () => {

  var options = new chromeDriver.Options();
  options.setUserPreferences({
    "download.prompt_for_download": false,
  });


  options.addArguments('--headless');
  options.addArguments("--mute-audio");


  let driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  await driver.get("https://www.emailnator.com");


  var cookie_xpath = "/html/body/div/div/div/p/button";
  await driver.wait(until.elementLocated(By.xpath(cookie_xpath))).sendKeys(Key.RETURN);

  email_path = "/html/body/div/div/main/div[1]/div/div/div/div[2]/div/div[1]/input";
  let email_is_gmail = false;
  while (email_is_gmail == false) {
    var email = await driver.findElement(By.xpath(email_path)).getAttribute("value");
    if (email.includes("@gmail.com") == true) {
      email_is_gmail = true;
    }
    else {
      await driver.navigate().refresh();
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
    driver.quit();
  }

  return [outcome, temp_mail_window_handle, elevenlabs_window_handle, email, driver];



}







