package ee.ut.monto.service;

import ee.ut.monto.model.*;
import ee.ut.monto.repository.AccountRepository;
import ee.ut.monto.repository.CategoryRepository;
import ee.ut.monto.repository.RegruleRepository;
import ee.ut.monto.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class FileTransactions {
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private RegruleRepository regruleRepository;

    public void saveCSVFileBankStatements(String[][] bankStatements, User user) {
        try {
            for (int i = 0; i < bankStatements.length - 1; i++) {
                String date = bankStatements[i][0];
                String categoryName = bankStatements[i][1];
                String description = bankStatements[i][2];
                Double sum = Double.parseDouble(bankStatements[i][3].replace(",", "."));

                if (bankStatements[i][4].equals("Expense"))
                    sum = -sum;

                String accountName = bankStatements[bankStatements.length - 1][0];
                saveBankStatement(date, categoryName, description, sum, user, accountName);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void saveBankStatement(String date, String categoryName, String description, Double sum, User user, String accountName) {
        Category category = null;
        List<Regrule> regrules = regruleRepository.findAllByUser(user);
        for (Regrule rule: regrules) {
            String patternString = ".*"+rule.getReg()+".*";
            Pattern pattern = Pattern.compile(patternString);
            Matcher matcher = pattern.matcher(categoryName);
            if (matcher.matches()) category = rule.getCategory();
        }

        Account account = accountRepository.findByName(accountName);

        Transaction transaction = new Transaction();
        transaction.setDate(date);
        transaction.setCategory(category);
        transaction.setDescription(description);
        transaction.setSum(sum);
        transaction.setUser(user);
        transaction.setAccount(account);

        transactionRepository.save(transaction);
    }
}