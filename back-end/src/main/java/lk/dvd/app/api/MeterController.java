package lk.dvd.app.api;

import lk.dvd.app.dto.MeterDTO;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("api/v1/meter")
public class MeterController {

    @Autowired
    private BasicDataSource dataSource;

    @PostMapping
    public ResponseEntity<?> saveReading(@RequestBody MeterDTO reading) {
        System.out.println(reading);
        try(Connection connection = dataSource.getConnection()){
            PreparedStatement stm = connection.prepareStatement("INSERT INTO meter_readings (account_no, reading_date, reading_value) VALUES (?,?,?)");
            stm.setString(1, reading.getAccountNumber());
            stm.setDate(2, reading.getDate());
            stm.setInt(3,reading.getValue());
            stm.executeUpdate();
            return new ResponseEntity<>(reading, HttpStatus.CREATED);
        }catch (SQLException e){
            if (e.getSQLState().equals("23000")){
                return new ResponseEntity<>(e.getMessage(),HttpStatus.CONFLICT);
            }else{
                return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @GetMapping
    public ResponseEntity<?> getBillDetails(@RequestParam(value = "q") String accountNumber) {
        try(Connection connection = dataSource.getConnection()){
            PreparedStatement stm = connection.prepareStatement
                    ("SELECT reading_date,reading_value FROM meter_readings WHERE account_no=? ORDER BY reading_date DESC");
            stm.setString(1, accountNumber);
            ResultSet rs = stm.executeQuery();
            List<MeterDTO> readingList = new ArrayList<>();
            while (rs.next()){
                Date readingDate = rs.getDate("reading_date");
                int readingValue = rs.getInt("reading_value");
                MeterDTO reading = new MeterDTO(accountNumber, readingDate, readingValue);
                readingList.add(reading);
            }
            return new ResponseEntity<>(readingList, HttpStatus.OK);
        }catch (SQLException e){
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
