import { Box, Card, Typography, Skeleton, useTheme } from '@mui/material';

function StatsCard({ title, value, icon, color, loading }) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: 3,
        backgroundColor: theme.palette.background.paper,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${color}33`,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        {/* Icon */}
        <Box
          sx={{
            p: 1.5,
            borderRadius: 1,
            backgroundColor: `${color}15`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 60,
            height: 60,
          }}
        >
          {icon}
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mb: 1, fontWeight: 500 }}
          >
            {title}
          </Typography>
          {loading ? (
            <Skeleton width="70%" height={32} />
          ) : (
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              {value}
            </Typography>
          )}
        </Box>
      </Box>
    </Card>
  );
}

export default StatsCard;