import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Link,
    Button,
    Heading,
    useColorModeValue,
    Text,
    VStack
  } from '@chakra-ui/react';
  
  export default function Login() {
    return (
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        
        <Box
            display='flex'
            alignItems='center'
            justifyContent='center'
            width='50%'
            color='teal'
        >
        
        <VStack
            display='flex'
            alignItems='center'
            justifyContent='center'
            width='50%'
        >
            <Heading as='h2' size='4xl' noOfLines={2}>
                Lottery D-App
            </Heading>

            <Text fontSize={'3xl'}>
                Sign in, Access your account and participate in our lottery contest to win prizes in the form of Ethereum coins
            </Text>
        </VStack>

        </Box>
        
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} color='teal'>Sign in to your account</Heading>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input type="email" />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input type="password" />
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  align={'start'}
                  justify={'space-between'}>
                  <Checkbox>Remember me</Checkbox>
                  <Link color={'teal'}>Forgot password?</Link>
                </Stack>
                <Button
                    colorScheme='teal'
                    variant='outline'
                >    
                    Submit
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    );
  }
  