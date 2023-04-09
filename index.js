const { Builder, By, Key, until } = require("selenium-webdriver");

const delay = ms => new Promise(res => setTimeout(res, ms));

// refresh the email either with the provided button or the page based on if elevenlabs innertext is present
// click on the link that activates the elevenlabs account
// get the x-api-key from elevenlabs profile tab
// then use the api https://api.elevenlabs.io/docs


async function thief() {

  var elevenlabs_account_created = false;

  while (elevenlabs_account_created == false) {
    var result = await get_temp_email_and_try_login_create_elevenlabs_account();
    var temp_mail_window_handle = result[1];
    var elevenlabs_window_handle = result[2];
    var email = result[3];
    var driver = result[4]
    elevenlabs_account_created = result[0];

    console.log(elevenlabs_account_created);
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
        console.log(email_text);
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
  var sign_in_submit_xpath = "/html/body/div[5]/div/div/div/div[2]/div/div/div[2]/div/form/div[4]/button";


  await driver.wait(until.elementLocated(By.xpath(sign_in_email_xpath))).sendKeys(email, Key.RETURN);
  await driver.findElement(By.xpath(sign_in_password_xpath)).sendKeys("Bisonoh.123568", Key.RETURN, Key.RETURN);

  // await driver.findElement(By.xpath(sign_in_submit_xpath)).click();



}











async function get_temp_email_and_try_login_create_elevenlabs_account() {
  let driver = await new Builder().forBrowser("chrome").build();
  await driver.get("https://www.emailnator.com");
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


thief();













