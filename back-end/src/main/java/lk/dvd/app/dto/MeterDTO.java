package lk.dvd.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MeterDTO {
    private String accountNumber;
    private Date date;
    private int value;
}
