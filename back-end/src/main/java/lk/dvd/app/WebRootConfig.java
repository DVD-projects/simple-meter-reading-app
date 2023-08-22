package lk.dvd.app;

import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WebRootConfig {

    @Bean
    public BasicDataSource getConnection() {
        BasicDataSource dataSource = new BasicDataSource();
        dataSource.setUsername("root");
        dataSource.setPassword("mysql");
        dataSource.setUrl("jdbc:mysql://localhost:3306/sanmark?createDatabaseIfNotExist=true");
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        dataSource.setInitialSize(10);
        dataSource.setMaxTotal(20);
        return dataSource;
    }
}
