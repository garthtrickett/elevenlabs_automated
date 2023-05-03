

import undetected_chromedriver as uc
import time


driver = uc.Chrome(driver_executable_path ="/home/user/files/code/naughty_books/chromedriver")
# driver = uc.Chrome(version_main=112)
driver.get('https://emailnator.com')


print(driver.session_id)



time.sleep(10000)
