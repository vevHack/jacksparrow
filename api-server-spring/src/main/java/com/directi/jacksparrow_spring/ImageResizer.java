package com.directi.jacksparrow_spring;

import java.awt.image.BufferedImage;

public class ImageResizer {

    public BufferedImage resizeImage(BufferedImage actualImage,
                                     int x, int y, int width, int height) {
        BufferedImage resizedImage = actualImage.getSubimage(x,y,width, height);
        return resizedImage;
    }

}
