package ee.ut.monto;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Action;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class MontoAutomatedTests {
    WebDriver driver = new ChromeDriver();
    WebDriverWait wait = new WebDriverWait(driver, 10);
    //    String url = "http://localhost:3000/";
    String url = "http://montoapp.herokuapp.com/";

    String email = "test@gmail.com";
    String password = "testpassword";

    private void register(String mail, String pass) {
        driver.navigate().to(url);

        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div[1]/div/div[1]/nav/ul/li[2]"))).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//a[text()='Sign Up']"))).click();

        wait.until(ExpectedConditions.presenceOfElementLocated((By.id("email")))).sendKeys(mail);
        wait.until(ExpectedConditions.presenceOfElementLocated((By.id("password")))).sendKeys(pass);
        wait.until(ExpectedConditions.presenceOfElementLocated((By.id("repeatedPassword")))).sendKeys(pass);

        wait.until(ExpectedConditions.presenceOfElementLocated((By.xpath("//button[text()='Register']")))).click();
    }

    private void logout() {
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id=\"root\"]/div/div[1]/nav/ul/li[3]"))).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//a[text()='Logout']"))).click();
    }

    private void login(String mail, String pass) {
        driver.navigate().to(url);

        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div[1]/div/div[1]/nav/ul/li[2]"))).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//a[text()='Log In']"))).click();

        wait.until(ExpectedConditions.presenceOfElementLocated((By.id("email")))).sendKeys(mail);
        wait.until(ExpectedConditions.presenceOfElementLocated((By.id("password")))).sendKeys(pass);

        wait.until(ExpectedConditions.presenceOfElementLocated((By.xpath("//button[text()='Log in']")))).click();
    }

    private void addTransaction(String type, String description, int sum) throws Exception { // transactions should be open
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//button[text()='Add " + type + "']"))).click();
        wait.until(ExpectedConditions.presenceOfElementLocated((By.id("description")))).sendKeys(description);
        wait.until(ExpectedConditions.presenceOfElementLocated((By.id("sum")))).sendKeys(Integer.toString(sum));
        wait.until(ExpectedConditions.presenceOfElementLocated((By.xpath("//button[text()='Save']")))).click();

        Thread.sleep(1000); // because of modal animation
    }

    private void editTransaction(String description, int sum) throws Exception {
        wait.until(ExpectedConditions.presenceOfElementLocated((By.id("description")))).sendKeys(description);
        wait.until(ExpectedConditions.presenceOfElementLocated((By.id("sum")))).sendKeys(Integer.toString(sum));
        wait.until(ExpectedConditions.presenceOfElementLocated((By.xpath("//button[text()='Save']")))).click();

        Thread.sleep(1000); // because of modal animation
    }

    private void openAccountView() throws Exception {
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//button[text()='Add income']"))).click();
        Thread.sleep(2000); // because of modal animation
        wait.until(ExpectedConditions.presenceOfElementLocated(By
                .xpath("/html/body/div[2]/div/div[1]/div/div/form/div[2]/div[3]/div/button"))).click();
    }

    private void addAccount(String name, String type) throws Exception {
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//button[text()='Add account']"))).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("name"))).sendKeys(name);
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("type"))).sendKeys(type);
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//button[text()='Save']"))).click();
        Thread.sleep(1000);
    }

    private void openCategoryView() throws Exception {
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//button[text()='Add income']"))).click();
        Thread.sleep(1000); // because of modal animation
        wait.until(ExpectedConditions.presenceOfElementLocated(By
                .xpath("/html/body/div[2]/div/div[1]/div/div/form/div[2]/div[2]/div/button"))).click();
    }

    private void exitAccCatView() throws Exception {
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//button[text()='Go back']"))).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//button[text()='Cancel']"))).click();
        Thread.sleep(1000);
        try {
            driver.switchTo().alert().accept();
        } catch (Exception e) {}
    }

    private void addCategory(String name) throws Exception {
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//button[text()='Add category']"))).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("name"))).sendKeys(name);
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//button[text()='Save']"))).click();
        Thread.sleep(1000);
    }

    private void editCategoryOrAccount(String editedName) throws Exception {
        wait.until(ExpectedConditions.presenceOfElementLocated((By.xpath("//button[text()='Edit']")))).click();
        wait.until(ExpectedConditions.presenceOfElementLocated((By.id("name")))).clear();
        wait.until(ExpectedConditions.presenceOfElementLocated((By.id("name")))).sendKeys(editedName);
        wait.until(ExpectedConditions.presenceOfElementLocated((By.xpath("//button[text()='Save']")))).click();
        Thread.sleep(1000);
    }

    private void deleteCategoryOrAccount() {
        wait.until(ExpectedConditions.presenceOfElementLocated((By.xpath("//button[text()='Delete']")))).click();
    }

    @Test
    public void uc4() throws Exception { // check dashboard
        login(email, password);
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//a[text()='Transactions']"))).click();

        // add expense
        addTransaction("expense", "test expense", 20);

        // check dashboard
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//a[text()='Dashboard']"))).click();
        Assert.assertTrue(driver.getPageSource().contains("Dashboard"));

        // delete expense
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//a[text()='Transactions']"))).click();
        wait.until(ExpectedConditions.elementToBeClickable((By.xpath("//*[@id=\"root\"]/div[2]/table/tbody/tr/td[6]/button")))).click();
    }

    @Test
    public void uc1_6_7() throws Exception { // add, edit, delete expense
        login(email, password);
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//a[text()='Transactions']"))).click();

        // add expense
        addTransaction("expense", "test expense", 20);
        Assert.assertTrue(driver.getPageSource().contains("-20,00"));
        Assert.assertTrue(driver.getPageSource().contains("test expense"));

        // edit expense
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id=\"root\"]/div[2]/table/tbody/tr/td[7]/button"))).click();
        wait.until(ExpectedConditions.presenceOfElementLocated((By.id("description")))).clear();
        wait.until(ExpectedConditions.presenceOfElementLocated((By.xpath("//*[@id=\"sum\"]")))).clear();
        editTransaction("Edited transaction", 300);
        Assert.assertTrue(driver.getPageSource().contains("Edited transaction"));

        // delete expense
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id=\"root\"]/div[2]/table/tbody/tr/td[6]/button"))).click();
        Assert.assertFalse(driver.getPageSource().contains("Edited transaction"));
    }

    @Test
    public void uc3_9_10() throws Exception { // add, edit, delete income
        login(email, password);
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//a[text()='Transactions']"))).click();

        // add income
        addTransaction("income", "test income", 20);
        Assert.assertTrue(driver.getPageSource().contains("20,00"));
        Assert.assertTrue(driver.getPageSource().contains("test income"));

        // edit income
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id=\"root\"]/div[2]/table/tbody/tr/td[7]/button"))).click();
        wait.until(ExpectedConditions.presenceOfElementLocated((By.id("description")))).clear();
        wait.until(ExpectedConditions.presenceOfElementLocated((By.xpath("//*[@id=\"sum\"]")))).clear();
        editTransaction("Edited transaction", 300);
        Assert.assertTrue(driver.getPageSource().contains("Edited transaction"));

        // delete income
        wait.until(ExpectedConditions.elementToBeClickable((By.xpath("//button[text()='Delete']")))).click();
        Assert.assertFalse(driver.getPageSource().contains("Edited transaction"));
    }

    @Test
    public void uc2_5_19_20() throws Exception{ // login, register, delete user, change password
        String mail = "temporary@a";
        String pass = "temporary";
        String newPass = "newPassword";

        // register
        Assert.assertFalse(driver.getPageSource().contains("Transactions"));
        register(mail, pass);
        Thread.sleep(1000);
        Assert.assertTrue(driver.getPageSource().contains("Transactions"));

        // login with old password
        logout();
        login(mail, pass);
        Thread.sleep(1000);
        Assert.assertTrue(driver.getPageSource().contains("Transactions"));

        // change password
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id=\"root\"]/div/div[1]/nav/ul/li[3]"))).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//a[text()='Settings']"))).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id=\"root\"]/div/div[2]/table/tbody/tr[1]/td[2]/button"))).click();
        wait.until(ExpectedConditions.presenceOfElementLocated((By.id("password")))).sendKeys(pass);
        wait.until(ExpectedConditions.presenceOfElementLocated((By.id("repeatedPassword")))).sendKeys(newPass);
        wait.until(ExpectedConditions.presenceOfElementLocated((By.id("repeatedPassword2")))).sendKeys(newPass);
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div[2]/div/div[1]/div/div/div[2]/form/div[4]/button[1]"))).click();
        Thread.sleep(1000);
        driver.switchTo().alert().accept();
        logout();
        Assert.assertFalse(driver.getPageSource().contains("Transactions"));
        login(mail, newPass);
        Thread.sleep(1000);
        Assert.assertTrue(driver.getPageSource().contains("Transactions"));

        // delete user
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id=\"root\"]/div/div[1]/nav/ul/li[3]"))).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//a[text()='Settings']"))).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id=\"root\"]/div/div[2]/table/tbody/tr[3]/td[2]/button"))).click();
        Thread.sleep(1000);
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div[2]/div/div[1]/div/div/div[2]/form/div/button[1]"))).click();
        Thread.sleep(1000);
        Assert.assertFalse(driver.getPageSource().contains("Transactions"));
        login(mail, newPass);
        Assert.assertFalse(driver.getPageSource().contains("Transactions"));
    }

    @Test
    public void uc11_16() throws Exception { // changing categories
        login(email, password);
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//a[text()='Transactions']"))).click();
        openCategoryView();
        Assert.assertFalse(driver.getPageSource().contains("Sport"));

        addCategory("Sport");
        Assert.assertTrue(driver.getPageSource().contains("Sport"));

        editCategoryOrAccount("Gym");
        Assert.assertFalse(driver.getPageSource().contains("Sport"));
        Assert.assertTrue(driver.getPageSource().contains("Gym"));

        deleteCategoryOrAccount();
        Assert.assertFalse(driver.getPageSource().contains("Gym"));
    }

//    @Test
//    public void uc14_15_18() throws Exception { // add, delete account, add transactions under different accounts
//        login(email, password);
//        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//a[text()='Transactions']"))).click();
//        openAccountView(); // doesnt work
//        Assert.assertFalse(driver.getPageSource().contains("Swedbank"));
//
//        addAccount("Swedbank", "business");
//        Assert.assertTrue(driver.getPageSource().contains("Swedbank"));
//        addAccount("SEB", "business");
//        Assert.assertTrue(driver.getPageSource().contains("SEB"));
//
//        deleteCategoryOrAccount();
//        deleteCategoryOrAccount();
//        Assert.assertFalse(driver.getPageSource().contains("Swedbank"));
//        Assert.assertFalse(driver.getPageSource().contains("SEB"));
//    }
}
