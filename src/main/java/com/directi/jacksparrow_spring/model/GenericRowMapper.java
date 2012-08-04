package com.directi.jacksparrow_spring.model;

import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;

public class GenericRowMapper<T> implements RowMapper<T> {

    private Class<T> clazz;
    private Map<String, String> bindings; // DB field -> POJO field

    public GenericRowMapper(Class<T> clazz, Map<String, String> bindings) {
        this.clazz = clazz;
        this.bindings = bindings;
    }

    @Override
    public T mapRow(ResultSet rs, int rowNum) throws SQLException {
        try {
            T t = clazz.newInstance();
            for (Map.Entry<String, String> entry: bindings.entrySet()) {
                clazz.getDeclaredField(entry.getValue()).set(
                        t, rs.getObject(entry.getKey()));
            }
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
