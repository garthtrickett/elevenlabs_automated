const { Builder, By, Key, until } = require("selenium-webdriver");

const delay = ms => new Promise(res => setTimeout(res, ms));

// refresh the email either with the provided button or the page based on if elevenlabs innertext is present
// click on the link that activates the elevenlabs account
// get the x-api-key from elevenlabs profile tab
// then use the api https://api.elevenlabs.io/docs


async function thief() {

  var elevenlabs_account_created = false;

  while (elevenlabs_account_created == false) {
    let result = await get_temp_email_and_try_login_create_elevenlabs_account();
    let temp_mail_window_handle = result[1];
    let elevenlabs_window_handle = result[2];
    let email = result[3];
    let driver = result[4]
    elevenlabs_account_created = result[0];

    console.log(elevenlabs_account_created);
  }


  // await driver.switchTo().window(temp_mail_window_handle);

  // const messages = await driver.findElement(By.className('message_container'));

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













