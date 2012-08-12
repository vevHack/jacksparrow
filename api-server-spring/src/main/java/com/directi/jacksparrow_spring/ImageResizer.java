package com.directi.jacksparrow_spring;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;

public class ImageResizer {

    public BufferedImage resizeImage(BufferedImage actualImage,
                                     int x, int y, int width, int height) {
        BufferedImage resizedImage = actualImage.getSubimage(x,y,width, height);
        return resizedImage;
    }

    public byte[] getBytes (BufferedImage image) throws Exception{
        ByteArrayOutputStream opStream = new ByteArrayOutputStream();
        ImageIO.write(image, "png", opStream);
        opStream.flush();
        return opStream.toByteArray();
    }
}
