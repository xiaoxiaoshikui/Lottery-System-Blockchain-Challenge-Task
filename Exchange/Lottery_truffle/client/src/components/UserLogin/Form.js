import { Input, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Heading } from '@chakra-ui/react'
import { VStack } from '@chakra-ui/react'
import React from 'react'

function Form() {
  const [value, setValue] = React.useState('')
  const handleChange = (event) => setValue(event.target.value)


  return (
    <VStack>
    <Box
        display='flex'
        alignItems='center'
        justifyContent='center'
        width='50%'
        color='teal'
    >
        
        <Heading as='h2' size='4xl' noOfLines={1}>
            Lottery D-App
        </Heading>
    </Box>
    <Box
        display='flex'
        alignItems='center'
        justifyContent='center'
        width='50%'
        py={12}
        bgPosition='center'
        bgRepeat='no-repeat'
        mb={2}
     >
        <InputGroup>
        <InputLeftElement
        pointerEvents='none'
        color='gray.300'
        fontSize='1.2em'
        children='$'
        />
        <Input 
            value={value}
            onChange={handleChange}
            placeholder='Enter your lucky number' />
        <InputRightElement children={<CheckIcon color='green.500' />} />
        </InputGroup>

        <Button
            colorScheme='teal'
            variant='outline'
            >    
            Submit
        </Button>
    </Box>
    </VStack>
  )
}

export default Form