import numpy as np
import math
from statistics import mean, stdev

def create_spectrum_roi(data, epi, endo):
    roi_list = ["epi", "endo"]
    rois = [epi.astype(int), endo.astype(int)]
    masks = np.zeros((data.shape + (len(roi_list),)))
    map_mask = np.zeros((data.shape + (len(roi_list),)))
    
    for i in range(np.size(data, 2)):
        dataslice = data[:,:,:,i]
        for j, mask in enumerate(rois):
            mask_spectrum = np.stack([mask]*np.size(data, 2), -1)
            ##Apply masks to spectral data##
            data_mask = dataslice*mask_spectrum
            ##Store masks in array##
            masks[:,:,:,i,j] = data_mask
            map_mask[:,:,i,j] = mask
    return masks, map_mask


def segment(image, mask, arv, irv):
    '''
    Takes an image and a mask of the myocardium (ones inside) and returns a
    cell array where the contents of each element represent the pixels that
    are within that AHA segment. The result can then be used to compute
    means, standard deviations etc. for each segment.

    RETURNS: (segmented_pixels, segmented_indices), where
        segmented_pixels  =  An array where each element is the pixels from
                             the image within each sector
        segmented_indices =  An array where each element is the indices of
                             the mask within each sector
    '''
    
    def centroid(array):
        x_c = 0
        y_c = 0
        area = array.sum()
        it = np.nditer(array, flags=['multi_index'])
        for i in it:
            x_c = i * it.multi_index[1] + x_c
            y_c = i * it.multi_index[0] + y_c
        return (int(x_c/area), int(y_c/area))
    
    # Find centroid and mask coordinates
    [cx, cy] = centroid(mask)
    [y, x] = np.nonzero(mask)
    inds = np.nonzero(mask)

    # Offset all points by centroid
    x = x - cx
    y = y - cy
    arvx = arv[0] - cx
    arvy = arv[1] - cy
    irvx = irv[0] - cx
    irvy = irv[1] - cy

    # Find angular segment cutoffs
    pi = math.pi
    arv_ang = math.atan2(arvy, arvx) % (2*pi)
    irv_ang = math.atan2(irvy, irvx) % (2*pi)
    ang = math.atan2(y, x) % (2*pi)
    sept_cutoffs = np.linspace(0, arv_ang - irv_ang, num=3) # two septal segments
    wall_cutoffs = np.linspace(arv_ang - irv_ang, 2*pi, 5)  # four wall segments
    cutoffs = np.array([sept_cutoffs, wall_cutoffs])
    ang = ang - irv_ang % (2*pi)

    # Create arrays of each pixel/index in each segment
    segment_image = lambda a, b : inds[ang >= a and ang <= b]
    get_pixels = lambda inds : image[inds]

    segmented_indices = segment_image(cutoffs[:6], cutoffs[1:])
    segmented_pixels = get_pixels(segmented_indices)

    return (segmented_pixels, segmented_indices)


def generate_zspec(images, masks, arvs, irvs):

    signal_intensities = []
    signal_mean = []
    signal_std = []
    signal_n = []
    indices = []
    values = []
    zspec = np.zeros((len(images) - 1, 6))

    for i in range(len(images)):
        intensities, inds = segment(images[i], masks[i], arvs[i], irvs[i])
        values.append(intensities)
        indices.append(inds)

        sig_intensity, sig_mean, sig_std, sig_n = [], [], [], []
        for seg in range(6):
            v = intensities[seg]
            ids = np.isfinite(v)
            sig_intensity += v[ids]
            sig_mean += mean(v[ids])
            sig_std += stdev(v[ids])
            sig_n += len(v[ids])

        signal_intensities.append(sig_intensity)
        signal_mean.append(sig_mean)
        signal_std.append(sig_std)
        signal_n.append(sig_n)

    for seg in range(1,6):
        zspec[:, seg] = signal_mean[1:] / signal_mean[0, seg]

    return zspec, signal_mean, signal_std, signal_n, signal_intensities, indices


def b0_correction(freq_offsets, zspec):
    return (freq_offsets, zspec)