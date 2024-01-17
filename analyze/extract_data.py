import numpy as np
from matplotlib.path import Path
from backend.settings import MEDIA_ROOT
from pydicom import dcmread
import os


def load_data(identifier): #TODO: Add image sorting?
        '''
        Create a 4D matrix (with dimensions x, y, offset, slice) of a previously uploaded 
        dataset and a list of its corresponding offset values.
        '''
 
        root = f'{MEDIA_ROOT}/uploads/{identifier}/images'
        directory = os.listdir(root)
        offsets = []
        data = []
        offset_num = -1
        for f in directory:
            ds = dcmread(os.path.join(MEDIA_ROOT, f'uploads/{identifier}/{f[:-4]}.dcm'))
            if int(f.split('-')[-1]) == 1:
                offset_num += 1
                data[offset_num] = [ds.pixel_array]
                offsets += int(protocol_name[ppm_index - 1])
            else:
                data[offset_num].append(ds.pixel_array)
            protocol_name = ds["Protocol Name"].split('_')
            ppm_index = protocol_name.index("ppm")
            
        return data, offsets


def pointsToMask(poly_verts_list, nx, ny):
        '''Convert a list of polygon vertices to a list of masks'''
        
        nx, ny = int(nx), int(ny)
        x, y = np.meshgrid(np.arange(nx), np.arange(ny))
        x, y = x.flatten(), y.flatten()
        points = np.vstack((x, y)).T
        grid = np.zeros(nx * ny, dtype=bool)

        if len(poly_verts_list[0]) == 2:
            poly_verts_list = [[point[1]] for point in poly_verts_list]

        for poly_verts in poly_verts_list:
        
            path = Path(poly_verts)
            # Check if points are inside the polygon
            poly_mask = path.contains_points(points)
            grid = np.logical_or(grid, poly_mask)

        grid = grid.reshape((ny, nx))
        return grid