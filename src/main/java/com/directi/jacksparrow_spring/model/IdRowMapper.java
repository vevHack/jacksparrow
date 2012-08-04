package com.directi.jacksparrow_spring.model;

import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class IdRowMapper<T> implements RowMapper<T> {

    private Class<T> clazz;

    public IdRowMapper(Class<T> clazz) {
        this.clazz = clazz;
    }

    @Override
    public T mapRow(ResultSet rs, int rowNum) throws SQLException {
        try {
            T t = clazz.newInstance();
            clazz.getDeclaredField("id").set(t, rs.getInt("id"));
            return t;
        } catch (NoSuchFieldException ex) {
            throw new RuntimeException(ex);
        } catch (IllegalAccessException ex) {
            throw new RuntimeException(ex);
        } catch (InstantiationException ex) {
            throw new RuntimeException(ex);
        }
    }

}
