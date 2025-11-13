import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface InfoCardProps {
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    style?: ViewStyle;
}

export const InfoCard: React.FC<InfoCardProps> = ({
    title,
    message,
    type = 'info',
    style
}) => {
    const getCardStyle = () => {
        switch (type) {
            case 'success': return styles.successCard;
            case 'warning': return styles.warningCard;
            case 'error': return styles.errorCard;
            default: return styles.infoCard;
        }
    };

    const getTitleStyle = () => {
        switch (type) {
            case 'success': return styles.successTitle;
            case 'warning': return styles.warningTitle;
            case 'error': return styles.errorTitle;
            default: return styles.infoTitle;
        }
    };

    return (
        <View style={[styles.card, getCardStyle(), style]}>
            <Text style={[styles.title, getTitleStyle()]}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 16,
        borderRadius: 8,
        marginVertical: 8,
    },
    infoCard: {
        backgroundColor: '#dbeafe',
        borderLeftWidth: 4,
        borderLeftColor: '#3b82f6',
    },
    successCard: {
        backgroundColor: '#d1fae5',
        borderLeftWidth: 4,
        borderLeftColor: '#10b981',
    },
    warningCard: {
        backgroundColor: '#fef3c7',
        borderLeftWidth: 4,
        borderLeftColor: '#f59e0b',
    },
    errorCard: {
        backgroundColor: '#fee2e2',
        borderLeftWidth: 4,
        borderLeftColor: '#ef4444',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    infoTitle: {
        color: '#1e40af',
    },
    successTitle: {
        color: '#065f46',
    },
    warningTitle: {
        color: '#92400e',
    },
    errorTitle: {
        color: '#991b1b',
    },
    message: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 20,
    },
});