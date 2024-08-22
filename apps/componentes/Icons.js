import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import colors from '../config/colors';

function Icons({name, size=24, iconcolor}) {
    return (
        <MaterialCommunityIcons name={name} size={size} color={iconcolor} />
    );
}

export default Icons;